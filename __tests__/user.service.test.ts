import { User } from "../src/models/user";
import { searchUser, createUser, getUser, confirmUser, updateUser, getUsers, getAdminUsers } from "../src/services/user";
import { Qualification } from "../src/models/qualification"; 
import { connectTestDB, closeTestDB, clearTestDB } from "../tests/setup";
import { Types } from "mongoose";
import { stringify } from "querystring";

jest.setTimeout(20000);

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});


// //search User
// describe("User service - searchUser with qualifications", () => {
//     it("should return users matching degree or field of expertise", async () => {
//       const userId = new Types.ObjectId();
  
//       const user = await User.create({
//         _id: userId,
//         firstName: "Olajide",
//         lastName: "Ayeni",
//         email: "olajide@example.com",
//         password: "Test1234!",
//         username: "olajide_dev",
//         accountType: "candidate",
//       });
  
//       const qualification = await Qualification.create({
//         user: userId,
//         degree: "Bachelor", // must match enum exactly
//         fieldOfExpertise: "Computer Science",
//         institution: "University of Lagos",
//         experienceYears: "5",
//         year: 2020,
//       });
  
//       // Link qualification to user
//       await User.findByIdAndUpdate(userId, {
//         qualifications: qualification._id,
//       });
  
//       // Now test searching by degree
//       const usersByDegree = await searchUser({
//         searchText: "BSc",
//       });

//     // 🔍 DEBUG: Print result to see full user object and qualification
//      //console.log(JSON.stringify(usersByDegree, null, 2));
  
//       expect(usersByDegree).toBeDefined();
//       expect(usersByDegree?.length).toBeGreaterThan(0);
//       expect(usersByDegree?.[0]?.firstName).toBe("Olajide");


//       //confirm user with the qualification is populated
//       const userResult = usersByDegree?.[0];
//       expect(userResult?.qualifications).toBeDefined(); 

//       //if qualification is populated as an object not an ID

//       if(typeof userResult?.qualifications === 'object' && userResult?.qualifications != null){
//         const q = userResult.qualifications as any;
//         expect(q.degree).toBe("Bachelor");
//         expect(q.fieldOfExpertise).toBe("Computer Science");
//       }
  
//       // search by field
//       const usersByField = await searchUser({
//         searchText: "Computer Science",
//       });
  
//       expect(usersByField).toBeDefined();
//       expect(usersByField?.length).toBeGreaterThan(0);
//       expect(usersByField?.[0]?.firstName).toBe("Olajide");
//     });
//   });

  



//   //createUser

//   describe("User service that creates user", () => {
//     it("should throw an error if email is missing", async () => {
//         await expect(
//             createUser({
//                 password: "StrongPass123!"
//             } as any)
//         ).rejects.toThrow("Email is required")
//     });


//     it("should only create a new user with email and username", async() => {
//         const user = await createUser({
//             email: "Olajide@example.com",
//             username: "Tester1",
//             password: "StrongPass123!"
//         });

//         //console.log(JSON.stringify(user, null, 2));

//         expect(user.email).toBe("olajide@example.com");
//         expect(user.username).toBe("tester1");
//         expect(user.password).toBeDefined();
//     });

//     it("should throw an error if email exists before", async () => {
//         // create user
//         await createUser({
//           email: "Olajide@example.com",
//           username: "UniqueUser",
//           password: "StrongPass123!"
//         });

//         //trying again with the same email
//         await expect(
//             createUser({
//               email: "Olajide@example.com",
//               username: "AnotherUser",
//               password: "StrongPass123!"
//             })
//           ).rejects.toThrow("Email already exists");
//         });

//   it("should throw an error if username exists before", async() => {
//     // First, create user
//     await createUser({
//         email: "unique@example.com",
//         username: "Tester1",
//         password: "StrongPass123!"
//       });
  
//       // Try again with same username
//       await expect(
//         createUser({
//           email: "another@example.com",
//           username: "Tester1",
//           password: "StrongPass123!"
//         })
//       ).rejects.toThrow("Username already exists");
//     });

//     it("should throw an error if email and username exists before", async () => {
//         // First, create user
//         await createUser({
//           email: "Olajide@example.com",
//           username: "Tester1",
//           password: "StrongPass123!"
//         });
    
//         // Try again with same email and username
//         await expect(
//           createUser({
//             email: "Olajide@example.com",
//             username: "Tester1",
//             password: "StrongPass123!"
//           })
//         ).rejects.toThrow("Email and username already exists");
//       });
//     });





//     //getUser 

// describe("User Service - getUser with userId, longOtpCode, email", () => {
//     it("should have at least one identifier", async() => {
//         await expect(
//             getUser({

//             } as any)
//         ).rejects.toThrow("At least one user identifier is required")
//     })

//     it("should find user by userId", async () => {
//         const createdUser = await User.create({
//           email: "userbyid@example.com",
//           username: "user_by_id",
//           password: "Pass123!",
//         });
    
//         const foundUser = await getUser({ userId: createdUser._id.toString() });
//         console.log(JSON.stringify(foundUser, null, 2));

    
//         expect(foundUser).not.toBeNull();
//         expect(foundUser?.email).toBe("userbyid@example.com");
//         expect(foundUser?.username).toBe("user_by_id");
//       });
    
//       it("should find user by email", async () => {
//         const createdUser = await User.create({
//           email: "userbyemail@example.com",
//           username: "user_by_email",
//           password: "Pass123!",
//         });
    
//         const foundUser = await getUser({ email: "userbyemail@example.com" });
    
//         expect(foundUser).not.toBeNull();
//         expect(foundUser?.username).toBe("user_by_email");
//       });
    
//       it("should find user by username", async () => {
//         const createdUser = await User.create({
//           email: "userbyusername@example.com",
//           username: "unique_username",
//           password: "Pass123!",
//         });
    
//         const foundUser = await getUser({ username: "unique_username" });
    
//         expect(foundUser).not.toBeNull();
//         expect(foundUser?.email).toBe("userbyusername@example.com");
//       });
    
//       it("should find user by longOtpCode", async () => {
//         const createdUser = await User.create({
//           email: "userbyotp@example.com",
//           username: "otpuser",
//           password: "Pass123!",
//           longOtpCode: "ABC123XYZ",
//         });
    
//         const foundUser = await getUser({ longOtpCode: "ABC123XYZ" });
    
//         expect(foundUser).not.toBeNull();
//         expect(foundUser?.email).toBe("userbyotp@example.com");
//       });
    
//       it("should return null if user not found by given identifier", async () => {
//         const result = await getUser({ email: "nonexistent@example.com" });
//         expect(result).toBeNull();
//       });
//     });





//     //confirmUser
//     describe("ConfirmUser - confirm user by ID", () =>{
//       it("Should confirm a user by Id", async() => {
//         const userId = new Types.ObjectId;

//         const user = await User.create({
//           _id: userId,
//           firstName: "Olajide",
//           lastName: "Ayeni",
//           email: "olajide@example.com",
//           password: "Test1234!",
//           username: "olajide_dev",
//           accountType: "candidate",
//           isVerified: false,
//         });

//         const result = await confirmUser(userId.toString());

//         expect(result).toBe(true)

//         const updatedUser = await User.findById(userId);
//         expect(updatedUser?.isVerified).toBe(true);  
//       });

//       it("Should throw an error if userId isn't provided", async () => {
//         await expect(
//           confirmUser(
//             ""
//           )
//         ).rejects.toThrow("Account not found, contact support")
//       });

//       it("Should return false if user doesn't exists", async () => {
//         const fakeId = new Types.ObjectId().toString();
//         const result = await confirmUser(fakeId);

//         console.log(JSON.stringify(fakeId, null, 2))

//         expect(result).toBe(false);
//       })
//     })



//update Users
// describe("UpdateUser - update all user fields", () => {
//   it("should update all editable fields correctly", async () => {
//     const userId = new Types.ObjectId();

//     // Create initial user
//     const user = await User.create({
//       _id: userId,
//       firstName: "Olajide",
//       lastName: "Ayeni",
//       email: "olajide@example.com",
//       password: "Test1234!",
//       username: "olajide_dev",
//       accountType: "candidate",
//       isVerified: false,
//       emailVerified: false,
//     });

//     // Create qualification
//     const qualification = await Qualification.create({
//       user: userId,
//       degree: "Bachelor",
//       fieldOfExpertise: "Computer Science",
//       institution: "University of Lagos",
//       experienceYears: 5,
//       year: 2020,
//     });

//     const updates = {
//       firstName: "John",
//       lastName: "Doe",
//       email: "john@example.com",
//       username: "john_dev",
//       location: "Lagos, Nigeria",
//       isVerified: "true",
//       dateOfBirth: new Date("1995-06-15"),
//       bio: "Backend engineer with experience in Node.js",
//       phone: "08123456789",
//       isBanned: true,
//       emailVerified: true,
//       lastSeen: new Date(),
//       accountType: "admin",
//       qualifications: qualification._id,
//     };

//     const updateResult = await updateUser(userId.toString(), updates);
//     expect(updateResult).toBe(true);

//     const updatedUser = await User.findById(userId).populate("qualifications");

//     console.log(JSON.stringify(updatedUser, null, 2))
//     // Assertions
//     expect(updatedUser?.firstName).toBe("John");
//     expect(updatedUser?.lastName).toBe("Doe");
//     expect(updatedUser?.email).toBe("john@example.com");
//     expect(updatedUser?.username).toBe("john_dev");
//     expect(updatedUser?.location).toBe("Lagos, Nigeria");
//     expect(updatedUser?.bio).toBe("Backend engineer with experience in Node.js");
//     expect(updatedUser?.phone).toBe("08123456789");
//     expect(updatedUser?.isBanned).toBe(true);
//     expect(updatedUser?.emailVerified).toBe(true);
//     expect(updatedUser?.accountType).toBe("admin");
//     expect(updatedUser?.qualifications?._id.toString()).toBe(qualification._id.toString());

//     // You may want to check this loosely due to timestamp milliseconds
//     expect(new Date(updatedUser?.dateOfBirth!).toISOString()).toBe(new Date("1995-06-15").toISOString());
//     expect(new Date(updatedUser?.lastSeen!).getTime()).toBeCloseTo(updates.lastSeen!.getTime(), -1);
//   });
// });





//get USers

describe("User Service - getUsers with pagination and filters", () => {
  it("should return all users without filter", async () => {
    await User.create([
      {
        firstName: "Olajide",
        lastName: "Ayeni",
        email: "jide1@example.com",
        password: "Test1234!",
        username: "jide1",
        accountType: "candidate"
      },
      {
        firstName: "Ayo",
        lastName: "Bamidele",
        email: "ayo@example.com",
        password: "Test1234!",
        username: "ayo_dev",
        accountType: "candidate"
      }
    ]);

    const result = await getUsers();

    expect(result).toBeDefined();
    expect(result.count).toBe(2);
    expect(result.users?.length).toBe(2); // added optional chaining
  });

  it("should return filtered users by email", async () => {
    await User.create([
      {
        firstName: "Test1",
        lastName: "User1",
        email: "filterme@example.com",
        password: "Test1234!",
        username: "filter_user",
        accountType: "candidate"
      },
      {
        firstName: "Ignore",
        lastName: "User2",
        email: "skip@example.com",
        password: "Test1234!",
        username: "skip_user",
        accountType: "candidate"
      }
    ]);

    const result = await getUsers(undefined, { email: "filterme@example.com" });

    expect(result).toBeDefined();
    expect(result.count).toBe(1);
    expect(result.users?.[0].email).toBe("filterme@example.com");
  });

  it("should respect pagination limit", async () => {
    const usersToInsert = Array.from({ length: 10 }, (_, i) => ({
      firstName: `User${i}`,
      lastName: `Test${i}`,
      email: `user${i}@example.com`,
      password: "Test1234!",
      username: `user${i}`,
      accountType: "candidate"
    }));

    await User.create(usersToInsert);

    const result = await getUsers({ from: 0, limit: 5 });

    expect(result).toBeDefined();
    expect(result.users?.length).toBe(5);
    expect(result.count).toBe(10);
  });

  it("should return empty result when no users match the filter", async () => {
    const result = await getUsers(undefined, { email: "notfound@example.com" });

    expect(result).toBeDefined();
    expect(result.count).toBe(0);
    expect(result.users?.length).toBe(0);
  });
});






//     await expect(
//         getUser({
//             userId: "user123",
//             username: "tester",
//             email: "unique1@gmail.com",
//             longOtpCode: "1234567890"
//         } as any)

//         await expect(
//             getUser({
//                 username: "tester",
//                 email: "unique1@gmail.com",
//                 longOtpCode: "1234567890"
//             })
//         )
//     ).rejects.toThrow ("userId is required")
// })


// describe("User Service - updateUserProfile", () => {
//     it("should update the user profile", async () => {
//       // First register the user
//       const user = await registerUser({
//         email: "profileupdate@gmail.com",
//         password: "SecurePass123!"
//       });
  
//       const updated = await updateUserProfile(user._id.toString(), {
//         firstName: "Jane",
//         lastName: "Doe",
//         phone: "08012345678",
//         dateOfBirth: new Date("1995-01-01"),
//         role: new Types.ObjectId(), // replace with valid role id
//       });
  
//       expect(updated.firstName).toBe("Jane");
//       expect(updated.lastName).toBe("Doe");
//       expect(updated.phone).toBe("08012345678");
//     });
  
//     it("should throw error if user is not found", async () => {
//       await expect(
//         updateUserProfile("665df7e48a9c5086a5a1f999", {
//           firstName: "Ghost",
//           lastName: "User",
//           phone: "1234567890",
//           dateOfBirth: new Date("1990-01-01"),
//           role: new Types.ObjectId(),
//         })
//       ).rejects.toThrow("User not found");
//     });
//   });
  




// // //create User
// // describe("User Service - registerUser", () => {
// //     it("should throw an error if email is missing", async () => {
// //         await expect(
// //             registerUser({
// //                 password: "StrongPass123!"
// //             } as any)  // casting to bypass TS check just for this test
// //         ).rejects.toThrow("Email is required")
// //     });


// //     it("should create a user with email and password only", async () => {
// //         const user = await registerUser({
// //             email: "test@gmail.com",
// //             password: "StrongPass123!"
// //         });

// //         expect(user.email).toBe("test@gmail.com");
// //         expect(user.password).toBeDefined();
// //     })

//     it("should not duplicate emails", async () => {
//         await registerUser({
//             email: "duplicate@gmail.com",
//             password: "StrongPass123!"
//         })

//         await expect(
//             registerUser({
//                 email: "duplicate@gmail.com",
//                 password: "StrongPass123!"
//             })
//         ).rejects.toThrow("Email already exists")
//     });

//     // it("should not allow duplicate usernames", async () => {
//     //     await registerUser({
//     //         email: "unique1@gmail.com",
//     //         username: "duplicateUser",
//     //         password: "StrongPass123!"
//     //     });

//     //     await expect(
//     //         registerUser({
//     //             email: "unique2@gmail.com",
//     //             username: "duplicateUser",
//     //             password: "StrongPass123!"
//     //         })
//     //     ).rejects.toThrow("Username already exists")
//     // });

//     // it("should throw an error if username and email both already exists", async () => {
//     //     await registerUser({
//     //         email: "conflict@gmail.com",
//     //         username: "conflictUser",
//     //         password: "StrongPass123!"
//     //     });

//     //     await expect(
//     //         registerUser({
//     //             email: "conflict@gmail.com",
//     //             username: "conflictUser",
//     //             password: "StrongPass123!"
//     //         })
//     //     ).rejects.toThrow("Email and username already exists");
//     // });
// });
