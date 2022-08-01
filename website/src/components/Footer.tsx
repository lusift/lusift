import { Logo } from '../components/Logo';

export interface FooterProps {}

export const Footer: React.FC<FooterProps> = props => {
    return (
        <footer className="jusify-self-end p-6 py-3 justify-center border-red-200 border-2 flex">
            <div className="max-w-5xl w-11/12 flex flex-col">
                <div className="w-10 h-10 mb-1.5">
                    <Logo small={true} />
                </div>
                <p className="text-gray-600 text-sm">
                    © 2022 Lusift. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
