// Matches the backend AuthenticationRequestDTO
export interface AuthenticationRequestDTO {
    email: string;
    password: string;
}

// Matches the backend AuthenticationResponseDTO
export interface AuthenticationResponseDTO {
    token: string;
}

// Matches the backend RegisterRequestDTO
export interface RegisterRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}