import React from 'react';
import { LabelWCProps } from '~/types';

export const Labelch: React.FC<LabelWCProps> = ({ children, label,className,OverrideLabelStyle }) => {
  return (
    <div className={className}>
      <label className={`text-xs mb-2 font-light text-[#CACACA] ${OverrideLabelStyle}`}>{label}</label>
      {children}
    </div>
  );
};
