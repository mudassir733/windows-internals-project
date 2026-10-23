use axum::{Json, Router, extract::Path, http::StatusCode, routing::get};
use serde_json::{Value, json};
mod current_process_pid;
mod process_details;
mod process_list;

// struct
pub mod models;

use models::ProcessInfo;
#[tokio::main]
async fn main() {
    // create the the router
    let app = Router::new().route("/api/process/{name}", get(get_process_handler));

    // listerner
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Rust API Server running at http://127.0.0.1:3000");
    println!("Try testing: http://127.0.0.1:3000/api/process/explorer.exe");

    axum::serve(listener, app).await.unwrap();
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
