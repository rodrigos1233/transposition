import React, { useEffect } from 'react';

export function useChangePageTitle(pageTitle: string) {
    useEffect(() => {
        document.title = `${pageTitle} - musictranspositor`;
    }, [pageTitle]);

    return 1;
}
