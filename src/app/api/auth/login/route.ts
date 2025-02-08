
import { NextResponse } from "next/server"
import { login } from "@/lib/auth"
import { client } from "@/sanity/lib/client"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await client.fetch(
      `*[_type == "user" && email == $email && password == $password][0]{
        _id,
        name,
        email,
        role,
        isActive,
        password,
      }`,
      { email, password },
    )
    // console.log("Login attempt:", { email, password });
    // console.log("User fetched:", user)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "User account is inactive" }, { status: 403 })
    }

    await login(user)

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, password: user.password },
      redirect: "/dashboard",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
