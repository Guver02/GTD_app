import React from 'react';
import { useLanguage } from '../custom_hooks/useLanguage';
import * as style from './CirculaStep.module.css'

const { text, circular, borderCircular } = style
function CircularStepProgress({ stepNumber, totalSteps, size = 52, strokeWidth = 6 }) {
    const { translation } = useLanguage()
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(stepNumber / totalSteps, 1);
    const offset = circumference * (1 - progress);

    return (
        <svg width={size} height={size} style={{ display: 'block' }}>
            <circle className={borderCircular}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle className={circular}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text className={text}
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"

            >
                {`${stepNumber} ${translation.of} ${totalSteps}`}
            </text>
        </svg>
    );
}

export { CircularStepProgress };
