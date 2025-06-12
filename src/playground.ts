// src/playground.ts

import { createUser } from "./services/user";
import { connectDB } from "./config/dbinit";

(async () => {
    await connectDB();

    try {
        const user = await createUser({
            email: "test@email.com",
            username: "testUser",
            password: "123456"
        });
        console.log("✅ Created User:", user)
    } catch (e) {
        console.error("❌ Error:", (e as Error).message);
    }

    process.exit()
}) ();