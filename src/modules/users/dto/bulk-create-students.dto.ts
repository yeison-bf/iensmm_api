
// Primero, actualiza tu DTO para que coincida con tus datos
export class BulkCreateStudentDto {
  user: {
    institution: number;  // Agregado
    firstName: string;
    lastName: string;
    document: string;
    notificationEmail: string;
    phone: string;
    address: string;
    gender: string;
    photoUrl: string;
    username: string;
    password: string;
    roleId: number;
    documentTypeId: string;
    headquarterIds: string;
  };
  studentInfo: {
    birthDate: string;  // Cambiado a string ya que recibes "41630"
    bloodType: string;
    birthDepartment: string;
    birthCity: string;
    population: string;
    disability: boolean;
    disabilityType?: string;
    healthProvider: string;
    observations?: string;
    programa?: string;
  };
  enrollment: {
    schedule: string;
    folio: string;
    registrationDate: string;  // Cambiado a string ya que recibes "45658"
    type: string;
    observations?: string;  // Opcional
    groupId: string;
    degreeId: string;
    headquarterId?: number;    // Opcional
    institutionId?: number;    // Opcional
    programId?: string;        // Opcional
  };
}