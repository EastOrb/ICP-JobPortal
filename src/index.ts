import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
    Principal,
    float64,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// ... (type definitions and imports)

// User functions
$update;
export function userRegister(payload: UsersPayload): Result<Users, string> {
    // Validate and sanitize inputs
    const fullName = sanitizeString(payload.fullName);
    const email = sanitizeEmail(payload.email);
    const phone = sanitizePhone(payload.phone);

    if (!isValidEmail(email) || !isValidPhone(phone)) {
        return Result.Err("Invalid email or phone");
    }

    // Authorization check
    if (!isAdmin()) {
        return Result.Err("Not authorized");
    }

    const user: Users = {
        id: ic.caller().toString(),
        registeredAt: ic.time(),
        fullName,
        email,
        phone,
    };

    users.insert(ic.caller(), user);
    return Result.Ok<Users, string>(user);
}

$query;
export function getWorkHistory(): Result<Vec<WorkHistory>, string> {
    if (!isAuthenticated()) {
        return Result.Err("Not authenticated");
    }

    const works = work
        .values()
        .filter((workHistory) => workHistory.userId === ic.caller().toString());
    return Result.Ok(works);
}

$update;
export function addWorkHistory(
    payload: WorkHistoryPayload
): Result<WorkHistory, string> {
    if (!isAuthenticated()) {
        return Result.Err("Not authenticated");
    }

    const user = users
        .values()
        .filter((usr) => usr.id === ic.caller().toString());
    if (user.length === 0) {
        return Result.Err("User not found");
    }

    // Validate and sanitize payload
    const companyName = sanitizeString(payload.companyName);
    const position = sanitizeString(payload.position);
    const yearStarted = payload.yearStarted;
    const yearEnded = payload.yearEnded;
    const salary = payload.salary;
    const description = sanitizeString(payload.description);

    const newWorkHistory: WorkHistory = {
        id: uuidv4(),
        userId: ic.caller().toString(),
        createdAt: ic.time(),
        companyName,
        position,
        yearStarted,
        yearEnded,
        salary,
        description,
    };
    work.insert(newWorkHistory.id, newWorkHistory);
    return Result.Ok<WorkHistory, string>(newWorkHistory);
}

// Update other functions similarly

// Helper functions
function sanitizeString(input: string): string {
    // Implement string sanitization logic
    return input.trim();
}

function sanitizeEmail(input: string): string {
    // Implement email sanitization logic
    return input.trim().toLowerCase();
}

function sanitizePhone(input: string): string {
    // Implement phone sanitization logic
    return input.trim();
}

function isValidEmail(email: string): boolean {
    // Implement email validation logic
    return true;
}

function isValidPhone(phone: string): boolean {
    // Implement phone validation logic
    return true;
}

// Authorization middleware for admin
function isAdmin(): boolean {
    // Implement authorization logic
    // Check if the caller is an admin
    return true;
}

// Authentication middleware
function isAuthenticated(): boolean {
    // Implement authentication logic
    // Check if the caller is authenticated
    return true;
}
