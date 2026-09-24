'use client';

import React from 'react';
import { AnimatedEnergyBackground } from './AnimatedEnergyBackground';

/**
 * MolecularBackground (Legacy Alias)
 * Forwards directly to the updated AnimatedEnergyBackground.
 */
export const MolecularBackground: React.FC = () => {
  return <AnimatedEnergyBackground />;
};

export { AnimatedEnergyBackground };
