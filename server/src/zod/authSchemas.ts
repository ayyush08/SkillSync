import { profile } from 'console';
import { z } from 'zod';








enum Fields {
    Software_Development = "Software_Development",
    Data_and_AI = "Data_and_AI",
    Cloud_and_Infrastructure = "Cloud_and_Infrastructure",
    Cybersecurity = "Cybersecurity",
    Blockchain = "Blockchain",
    Design_and_UX = "Design_and_UX",
    Product_and_Management = "Product_and_Management",
    Research_and_Academia = "Research_and_Academia",
    Miscellaneous = "Miscellaneous"
}


enum Professions {
    Frontend_Developer = "Frontend_Developer",
    Backend_Developer = "Backend_Developer",
    Fullstack_Developer = "Fullstack_Developer",
    Software_Engineer = "Software_Engineer",
    Mobile_Developer = "Mobile_Developer",
    Game_Developer = "Game_Developer",
    Embedded_Systems_Engineer = "Embedded_Systems_Engineer",
    Devops_Engineer = "Devops_Engineer",
    Qa_Engineer = "Qa_Engineer",
    Test_Automation_Engineer = "Test_Automation_Engineer",
    Data_Scientist = "Data_Scientist",
    Data_Analyst = "Data_Analyst",
    Data_Engineer = "Data_Engineer",
    Machine_Learning_Engineer = "Machine_Learning_Engineer",
    Ai_Researcher = "Ai_Researcher",
    Computer_Vision_Engineer = "Computer_Vision_Engineer",
    Nlp_Engineer = "Nlp_Engineer",
    Big_Data_Engineer = "Big_Data_Engineer",
    Cloud_Engineer = "Cloud_Engineer",
    Cloud_Solution_Architect = "Cloud_Solution_Architect",
    Site_Reliability_Engineer = "Site_Reliability_Engineer",
    Network_Engineer = "Network_Engineer",
    System_Administrator = "System_Administrator",
    Cybersecurity_Analyst = "Cybersecurity_Analyst",
    Penetration_Tester = "Penetration_Tester",
    Security_Engineer = "Security_Engineer",
    Cryptography_Engineer = "Cryptography_Engineer",
    Blockchain_Developer = "Blockchain_Developer",
    Smart_Contract_Developer = "Smart_Contract_Developer",
    Web3_Developer = "Web3_Developer",
    Ui_Ux_Designer = "Ui_Ux_Designer",
    Product_Designer = "Product_Designer",
    Graphic_Designer = "Graphic_Designer",
    Product_Manager = "Product_Manager",
    Technical_Project_Manager = "Technical_Project_Manager",
    Scrum_Master = "Scrum_Master",
    Research_Scientist = "Research_Scientist",
    Computer_Science_Lecturer = "Computer_Science_Lecturer",
    Technical_Writer = "Technical_Writer",
    Game_Designer = "Game_Designer",
    Ar_Vr_Developer = "Ar_Vr_Developer",
    Database_Administrator = "Database_Administrator",
    It_Support_Specialist = "It_Support_Specialist",
    Software_Architect = "Software_Architect",
    Cto = "Cto"
}

export const registerSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters long").max(15, "Username must be at most 15 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    fullName: z.string(),
    profilePic: z.string().optional(),
    bio: z.string().optional(),
    profession: z.nativeEnum(Professions),
    field: z.nativeEnum(Fields),
    skills: z.array(z.string()).optional(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
})


export const loginSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(8,"Passwords cannot be less than 8 characters long")
})