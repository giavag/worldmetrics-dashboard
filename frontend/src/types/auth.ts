// Matches the backend AuthenticationRequestDTO
export interface AuthenticationRequestDTO {
    email: string;
    password: string;
}

// Matches the backend AuthenticationResponseDTO
export interface AuthenticationResponseDTO {
    token: string;
}