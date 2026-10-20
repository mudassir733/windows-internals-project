mod current_process_pid;
mod process_list;
fn main() {
    current_process_pid::main();
    process_list::print_all_processes();
}
