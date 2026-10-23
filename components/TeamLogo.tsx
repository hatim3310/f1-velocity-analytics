import React, { useEffect, useState } from 'react';

interface Props {
  src?: string;
  name: string;
  className?: string;
}

const TeamLogo: React.FC<Props> = ({ src, name, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    const initials = name.split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase();
    return <span aria-hidden="true" className={`inline-flex items-center justify-center font-mono font-bold text-[9px] tracking-tight text-neutral-400 ${className}`}>{initials}</span>;
  }

  return <img src={src} alt="" className={className} onError={() => setFailed(true)} />;
};

export default TeamLogo;
