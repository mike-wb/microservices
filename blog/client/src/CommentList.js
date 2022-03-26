import React from 'react';

const App = ({ comments }) => {
    const renderedComments = comments.map(comment => {
        let content;

        if ( comment.status === 'approved' ) {
            content = comment.content;
        } else if ( comment.status === 'pending' ) {
            content = 'Comment is awaiting moderation';
        } else if ( comment.status === 'rejected' ) {
            content = 'Comment has been rejected';
        } else {
            content = 'Comment status is unknown'
        }
        
        return <li key={comment.id}>{content}</li>;
    });

    return <ul>
        {renderedComments}
    </ul>;
};

export default App;