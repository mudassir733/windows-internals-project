use std::mem;
use std::os::windows::raw::HANDLE;
use windows_sys::Win32::Foundation::{CloseHandle, GetLastError};
use windows_sys::Win32::System::ProcessStatus::{GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS};
use windows_sys::Win32::System::Threading::{
    GetCurrentProcessId, OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ,
};
pub fn main() {
    println!("=== HERE IS MY PROGRAM WINDOWS ID CARD ===\n");

    unsafe {
        // Get the PID of the current process
        let pid: u32 = GetCurrentProcessId();
        println!("Current Process ID: {}", pid);

        // define the permission
        let access_rights: u32 = PROCESS_QUERY_INFORMATION | PROCESS_VM_READ;

        // handle true and false
        let inherit_handle: i32 = 0; // false

        // open the process handle connection
        let handle: HANDLE = OpenProcess(access_rights, inherit_handle, pid);

        // check for handle find or not
        if handle == std::ptr::null_mut() {
            // GetLastError() can be used to get the error code if needed
            let error_code: u32 = GetLastError();
            println!("Failed to open process handle. Error code: {}", error_code);
            return; // exit the program if handle is not found
        }

        println!("Process handle find successfully");

        // store the memory information in structure
        let mut mem_counters: PROCESS_MEMORY_COUNTERS = mem::zeroed();

        // requirements of window api that the object should know their size
        mem_counters.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32;

        // ask for memory information
        let success: i32 = GetProcessMemoryInfo(handle, &mut mem_counters, mem_counters.cb);

        if success != 0 {
            // by default the memory is in bytes, so we can convert it to MB by 1048576 (1024 * 1024)
            let ram_usage_md: usize = mem_counters.WorkingSetSize / (1024 * 1024);
            println!("Memory Usage: {} MB", ram_usage_md);
        } else {
            let error_code: u32 = GetLastError();
            println!(
                "Failed to get process memory info. Error code: {}",
                error_code
            );
        }

        // clean up the handle after use
        let close_result: i32 = CloseHandle(handle);
        if close_result != 0 {
            println!("Process handle closed successfully");
        } else {
            let error_code: u32 = GetLastError();
            println!("Failed to close process handle. Error code: {}", error_code);
        }
    }
}
