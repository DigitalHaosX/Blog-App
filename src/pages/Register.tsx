import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Input, Button, Divider } from "@heroui/react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="gap-4 p-6">
          <h1 className="text-2xl font-bold text-foreground text-center">
            Create Account
          </h1>
          <p className="text-default-500 text-center text-sm">
            Sign up to get started
          </p>
          <Divider />
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              variant="bordered"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <Input
              type="password"
              label="Password"
              variant="bordered"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <Input
              type="password"
              label="Confirm Password"
              variant="bordered"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              isRequired
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <Button color="primary" type="submit" isLoading={loading} fullWidth>
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-default-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
