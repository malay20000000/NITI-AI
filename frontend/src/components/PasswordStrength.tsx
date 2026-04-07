import { motion } from 'framer-motion';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  
  const getColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getLabel = () => {
    if (!password) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-slate-500">Security Strength</span>
        <span className={strength <= 2 ? 'text-red-500' : strength <= 4 ? 'text-blue-500' : 'text-emerald-500'}>
          {getLabel()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <motion.div
            key={step}
            initial={{ width: 0 }}
            animate={{ width: step <= strength ? '20%' : '20%' }}
            className={`h-full transition-colors duration-500 ${
              step <= strength ? getColor() : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
