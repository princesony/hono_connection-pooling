import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
        MY_VAR:string
	}
}>();


// app.post('/api/v1/signup', async (c) => {
//     const prisma = new PrismaClient({
// 		datasourceUrl:"prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNzIxOWQ2NDgtZThhNi00Njg1LWI5YTMtMWVlOGY0NDgxODQxIiwidGVuYW50X2lkIjoiYzRiY2M1MDg5NTVmOThlYWExZjg2NThiMzVlMzNhNTcwNjYyMTNmOTBkN2Q3Y2JkOGYxNDdiYWU4ZWQ3ZjE3OSIsImludGVybmFsX3NlY3JldCI6IjJlOWViZTNhLTVmY2QtNDUzMC05ZGVjLTBhMDA3ZTcyOTk0MCJ9.16s-PORO_E_bFb-3HmbZwvisumd47-EcPTBj9eSqguo"	,
// 	}).$extends(withAccelerate());

// 	const body = await c.req.json();
// 	try {
// 		const user = await prisma.users.create({
// 			data: {
// 				email: body.email,
// 				password: body.password
// 			}
// 		});
// 		const jwt = await sign({ id: user.id }, "9584123044prince__");
// 		return c.json({ jwt });
// 	} catch(e) {
// 		c.status(403);
// 		return c.json({ error: "error while signing up" });
// 	}
// })
app.post('/api/v1/signup', async (c) => {
    
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
   console.log(c.env.DATABASE_URL)
	const body = await c.req.json();
	try {
		const user = await prisma.users.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})

app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl:"prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNzIxOWQ2NDgtZThhNi00Njg1LWI5YTMtMWVlOGY0NDgxODQxIiwidGVuYW50X2lkIjoiYzRiY2M1MDg5NTVmOThlYWExZjg2NThiMzVlMzNhNTcwNjYyMTNmOTBkN2Q3Y2JkOGYxNDdiYWU4ZWQ3ZjE3OSIsImludGVybmFsX3NlY3JldCI6IjJlOWViZTNhLTVmY2QtNDUzMC05ZGVjLTBhMDA3ZTcyOTk0MCJ9.16s-PORO_E_bFb-3HmbZwvisumd47-EcPTBj9eSqguo"	,
	}).$extends(withAccelerate());
  
	const body = await c.req.json();
	const user = await prisma.users.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id },"djkjfndjknvjkd vn fdvn njf vnj dnmknjkdcm dcm kndjkncjkdm dsckn");
	return c.json({ jwt });
})



export default app; // export the app