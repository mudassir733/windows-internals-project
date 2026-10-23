use axum::{Json, Router, extract::Path, http::StatusCode, routing::get};
use serde_json::{Value, json};
use tower_http::cors::CorsLayer;
mod current_process_pid;
mod process_details;
mod process_list;

// struct
pub mod models;

use models::{ProcessInfo, ProcessListItem};

#[tokio::main]
async fn main() {
    // allow for all origin for now
    let cors = CorsLayer::permissive();
    // create the the router
    let app = Router::new()
        .route("/api/processes", get(get_all_processes_handler))
        .route("/api/process/{name}", get(get_process_handler))
        .layer(cors);

    // listerner
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001")
        .await
        .unwrap();
    println!("Rust API Server running at http://127.0.0.1:3001");
    println!("List API: http://127.0.0.1:3001/api/processes");
    println!("Detail API: http://127.0.0.1:3001/api/process/explorer.exe");

    axum::serve(listener, app).await.unwrap();
}

async fn get_all_processes_handler() -> Json<Vec<ProcessListItem>> {
    let processes = process_list::get_all_processes_list();
    Json(processes)
}

async fn get_process_handler(
    Path(app_name): Path<String>,
) -> Result<Json<ProcessInfo>, (StatusCode, Json<Value>)> {
    if let Some(pid) = process_list::find_pid_by_name(&app_name) {
        if let Some(process_data) = process_details::get_process_info(pid, &app_name) {
            return Ok(Json(process_data));
        }
    }

    let error_message = json!({
        "error": format!("Process '{}' not found or access denied", app_name)
    });

    Err((StatusCode::NOT_FOUND, Json(error_message)))
}
