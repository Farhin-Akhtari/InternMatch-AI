
function InternshipCard({ internship }) {
    return (
        <article>
            <h3>{internship.role}</h3>
            <p>{internship.company}</p>
            <p>{internship.location}</p>
        </article>
    );
}

export default InternshipCard;
