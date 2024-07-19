import { useEffect, useState } from 'react';

import { debounce } from '../utilities/methods';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            // setWindowDimensions triggers rendering.
            setWindowDimensions(getWindowDimensions());
        }

        // debounce prevents frequent resizing events.
        window.addEventListener('resize', debounce(handleResize, 100));

        return () => {
            // Removes when the component using this hook is destroyed.
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowDimensions;
}