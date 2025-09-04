import SectionContentNoIcon from './section-content-no-icon';

export default function Section({ attributes, children }) {
    const { iconUrl: icon } = attributes;
    
    return (
        <>
            <div>
                {!icon && <SectionContentNoIcon />}
                {icon && <img src={icon} alt="Icon" width="50" />}
            </div>

            <div className="col-span-2">
                {children}
            </div>
        </>
    );
}