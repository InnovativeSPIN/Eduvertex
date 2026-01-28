import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { GraduationCap, Lock, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';

const roleRoutes: Record<UserRole, string> = {
	superadmin: '/admin/superadmin',
	executive: '/admin/executive',
	academic: '/admin/academic',
	faculty: '/faculty',
	student: '/student',
};

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<UserRole>('superadmin');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		const success = login(email, password, role);
		setIsLoading(false);

		if (success) {
			toast.success(`Welcome! Logged in as ${role}`);
			navigate(roleRoutes[role]);
		} else {
			toast.error('Invalid credentials. Use password: password123');
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left side - Branding */}
			<div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
				<div className="max-w-md text-center">
					<div className="mb-8 flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
							<GraduationCap className="h-10 w-10 text-primary-foreground" />
						</div>
					</div>
					<h2 className="text-3xl font-bold text-primary-foreground mb-2">Eduvertex Admin Suite</h2>
					<p className="text-muted-foreground">Empowering education management for admins, faculty, and students.</p>
				</div>
			</div>
			{/* Right side - Login Form */}
			<div className="flex flex-1 items-center justify-center p-6">
				<form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg p-8">
					<h1 className="text-2xl font-bold text-primary mb-6">Sign in to Admin Suite</h1>
					<div className="space-y-4">
						<div>
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
								<Input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="admin@edu.com"
									className="pl-10"
									required
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
								<Input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="password123"
									className="pl-10"
									required
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="role">Role</Label>
							<div className="relative">
								<Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
								<Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
									<SelectTrigger className="pl-10">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="superadmin">Super Admin</SelectItem>
										<SelectItem value="executive">Executive Admin</SelectItem>
										<SelectItem value="academic">Academic Admin</SelectItem>
										<SelectItem value="faculty">Faculty</SelectItem>
										<SelectItem value="student">Student</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>
			</div>
		</div>
	);
}
