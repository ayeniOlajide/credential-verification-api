import { createUser, getUser } from "../src/services/user";
import { connectTestDB, closeTestDB, clearTestDB } from "../tests/setup";

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});


//create User
describe("User Service - createUser", () => {
    it("should throw an error if email is missing", async () => {
        await expect(
            createUser({
                username: "testuser",
                password: "StrongPass123!"
            } as any)  // casting to bypass TS check just for this test
        ).rejects.toThrow("Email is required")
    });


    it("should create a user with email and username", async () => {
        const user = await createUser({
            email: "test@gmail.com",
            username: "tester",
            password: "StrongPass123!",
            firstName: "Ayomide",
            lastName: "Ayeni",
        });

        expect(user.email).toBe("test@gmail.com");
        expect(user.username).toBe("tester");
        expect(user.firstName).toBe("Ayomide");
        expect(user.lastName).toBe("Ayeni");
        expect(user.password).toBeDefined();
    })

    it("should not duplicate emails", async () => {
        await createUser({
            email: "duplicate@gmail.com",
            username: "uniqueUser1",
            password: "StrongPass123!"
        })

        await expect(
            createUser({
                email: "duplicate@gmail.com",
                username: "uniqueUser2",
                password: "StrongPass123!"
            })
        ).rejects.toThrow("Email already exists")
    });

    it("should not allow duplicate usernames", async () => {
        await createUser({
            email: "unique1@gmail.com",
            username: "duplicateUser",
            password: "StrongPass123!"
        });

        await expect(
            createUser({
                email: "unique2@gmail.com",
                username: "duplicateUser",
                password: "StrongPass123!"
            })
        ).rejects.toThrow("Username already exists")
    });

    it("should throw an error if username and email both already exists", async () => {
        await createUser({
            email: "conflict@gmail.com",
            username: "conflictUser",
            password: "StrongPass123!"
        });

        await expect(
            createUser({
                email: "conflict@gmail.com",
                username: "conflictUser",
                password: "StrongPass123!"
            })
        ).rejects.toThrow("Email and username already exists");
    });
});

//getUser service
//userId,email, username or longOtpcode

describe("User Service - getUser", () => {
    await expect(
        getUser({
            userId: "user123",
            username: "tester",
            email: "unique1@gmail.com",
            longOtpCode: "1234567890"
        } as any)

        await expect(
            getUser({
                username: "tester",
                email: "unique1@gmail.com",
                longOtpCode: "1234567890"
            })
        )
    ).rejects.toThrow ("userId is required")
})


