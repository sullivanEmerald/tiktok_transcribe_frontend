import React from 'react';

type LoaderProps = {
    className?: string;
    [key: string]: any;
};

export const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div className={className} style={styles.loaderContainer}>
            <div className="loader-spin"></div>
        </div>
    );
};


const styles = {
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '160px',
        height: 'calc(100vh - 100px)'
    }
}

