mod current_process_pid;
mod process_details;
mod process_list;
fn main() {
    current_process_pid::main();
    process_list::print_all_processes();

    let target_app: &str = "powershell.exe";

    if let Some(dynamic_pid) = process_list::find_pid_by_name(target_app) {
        println!("found it {}: Current PID is: {}", target_app, dynamic_pid);

        process_details::show_process_id_card(dynamic_pid);
    } else {
        println!(
            "there is no target app currently running in the system: {}",
            target_app
        );
    }
}
