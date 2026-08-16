import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input.jsx';

const PasswordInput = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="pointer-events-auto text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
