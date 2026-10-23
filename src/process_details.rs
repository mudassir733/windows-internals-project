use std::mem;
use windows_sys::Win32::Foundation::{CloseHandle, GetLastError, HANDLE};
use windows_sys::Win32::System::ProcessStatus::{GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS};
use windows_sys::Win32::System::Threading::{
    OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ, QueryFullProcessImageNameW,
};

pub fn show_process_id_card(pid: u32) {
    println!("\n=== PROCESS ID CARD (PID: {}) ===", pid);

    unsafe {
        // trying to open the process
        let access_rights: u32 = PROCESS_QUERY_INFORMATION | PROCESS_VM_READ;
        let handle: HANDLE = OpenProcess(access_rights, 0, pid);

        // if access is 0 its mean OS doesnt allow the access
        if handle.is_null() {
            let error_code = GetLastError();

            // error 5 mean in widnows it mean access denied
            if error_code == 5 {
                println!("Access Denied! (HTTP 403 Forbidden).");
            } else {
                println!(
                    "Failed the program read the code to understand the issue, Error code is: {:?}",
                    error_code
                );
            }

            return;
        }

        // get the process path
        let mut path_buffer: [u16; 1024] = [0; 1024];
        let mut buffer_size: u32 = path_buffer.len() as u32;

        let path_success =
            QueryFullProcessImageNameW(handle, 0, path_buffer.as_mut_ptr(), &mut buffer_size);

        if path_success != 0 {
            let path_string: String =
                String::from_utf16_lossy(&path_buffer[..buffer_size as usize]);
            println!("Path: {}", path_string);
        } else {
            println!("Path nahi mila.");
        }

        // get the process Ram Usage
        let mut mem_counters: PROCESS_MEMORY_COUNTERS = mem::zeroed();
        mem_counters.cb = mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32;

        if GetProcessMemoryInfo(handle, &mut mem_counters, mem_counters.cb) != 0 {
            let ram_usage_mb: usize = mem_counters.WorkingSetSize / (1024 * 1024);
            println!("🧠 RAM Usage: {} MB", ram_usage_mb);
        }

        CloseHandle(handle);
    }
}
