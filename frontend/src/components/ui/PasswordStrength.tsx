import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 6) score += 1;
    if (pass.length > 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*]/.test(pass)) score += 1;
    return score;
  };

  const score = getStrength(password);

  const getColor = (index: number) => {
    if (index > score) return 'bg-gray-200';
    switch (score) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  const getLabel = () => {
    switch (score) {
      case 0: return 'Enter password';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Password strength</span>
        <span className="text-xs font-medium text-gray-700">{getLabel()}</span>
      </div>
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`flex-1 rounded-full transition-colors duration-300 ${getColor(item)}`}
          />
        ))}
      </div>
    </div>
  );
};