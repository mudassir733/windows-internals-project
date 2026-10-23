mod current_process_pid;
mod process_details;
mod process_list;

// struct
pub mod models;
fn main() {
    current_process_pid::main();
    process_list::print_all_processes();

    let target_app: &str = "powershell.exe";
    println!("Searching for: {}...", target_app);

    if let Some(dynamic_pid) = process_list::find_pid_by_name(target_app) {
        if let Some(process_data) = process_details::get_process_info(dynamic_pid, target_app) {
            match serde_json::to_string_pretty(&process_data) {
                Ok(json_string) => {
                    println!("\nAPI Ready JSON Data:");
                    println!("{}", json_string);
                }
                Err(e) => println!("Error while converting to JSON: {}", e),
            }
        } else {
            println!("Error while getting the data, seem like (Access denied).");
        }
    } else {
        println!("{} Not found.", target_app);
    }
}
