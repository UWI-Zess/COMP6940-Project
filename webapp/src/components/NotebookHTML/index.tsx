import React from 'react';

interface NotebookComponentProps {
    notebookHtmlContent: string;
}

const NotebookHTMLComponent = ({ notebookHtmlContent }: { notebookHtmlContent: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: notebookHtmlContent }} />;
};

export default NotebookHTMLComponent;
