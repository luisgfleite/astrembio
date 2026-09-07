import type { ProfileLink } from '../types/link';

type LinkButtonProps = {
    link: ProfileLink;
}

export default function LinkButton({ link }: LinkButtonProps) {
    return (
        <a className="link-button" href={link.url}>
            {link.title}
        </a>
    );
}