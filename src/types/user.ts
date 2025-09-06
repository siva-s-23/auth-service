export interface GoogleProfile {
  id: string; // Google unique ID
  emails?: { value: string }[];
  name?: { givenName?: string; familyName?: string };
  photos?: { value: string }[];
}
