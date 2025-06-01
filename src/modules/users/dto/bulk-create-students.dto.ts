export class BulkCreateStudentDto {
  user: {
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
    birthDate: Date;
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
    registrationDate: Date;
    type: string;
    observations: string;
    groupId: string;
    degreeId: string;
    headquarterId: number;    // Agregado
    institutionId: number;    // Agregado
    programId: string;        // Agregado
  };
}