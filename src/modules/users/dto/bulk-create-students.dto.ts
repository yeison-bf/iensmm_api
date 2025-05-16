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
    documentTypeId: number;
    headquarterIds: number[];
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
  };
  enrollment: {
    schedule: string;
    folio: string;
    registrationDate: Date;
    type: string;
    observations: string;
    groupId: number;
    degreeId: number;
  };
}