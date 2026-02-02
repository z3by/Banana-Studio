import { useState, useEffect } from 'react';

const DROPDOWN_MAX_HEIGHT = 240;
const DROPDOWN_SPACING = 8;
const DROPDOWN_MIN_MARGIN = 16;

export const useDropdownPosition = (isOpen: boolean, triggerRef: React.RefObject<HTMLElement | null>) => {
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        let frameId: number;
        const updatePosition = () => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const dropdownHeight = DROPDOWN_MAX_HEIGHT;

                const style: React.CSSProperties = {
                    position: 'fixed',
                    left: rect.left,
                    width: rect.width,
                };

                if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                    style.bottom = viewportHeight - rect.top + DROPDOWN_SPACING;
                    style.top = 'auto';
                    style.maxHeight = Math.min(dropdownHeight, rect.top - DROPDOWN_MIN_MARGIN);
                } else {
                    style.top = rect.bottom + DROPDOWN_SPACING;
                    style.bottom = 'auto';
                    style.maxHeight = Math.min(dropdownHeight, spaceBelow - DROPDOWN_MIN_MARGIN);
                }
                setDropdownStyle(style);
            }
        };

        const handleUpdate = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(updatePosition);
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', handleUpdate, true);
            window.addEventListener('resize', handleUpdate);
        }

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [isOpen, triggerRef]);

    return dropdownStyle;
};
