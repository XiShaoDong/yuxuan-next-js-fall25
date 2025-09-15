import Link from "next/link";
export default function TOC() {
    return (
        <ul>
            <li>
                <Link href="/Labs" id="wd-lab1-link">
                    Home </Link>
            </li>
            <li>
                <Link href="/Labs/Lab1" id="wd-lab1-link">
                    Lab 1 </Link>
            </li>
            <li>
                <Link href="/Labs/Lab2" id="wd-lab2-link">
                    Lab 2 </Link>
            </li>
            <li>
                <Link href="/Labs/Lab3" id="wd-lab3-link">
                    Lab 3 </Link>
            </li>
            <li>
                <Link href="/" id="wd-lab3-link">
                    Kambaz </Link>
            </li>
            <li>
                <a href="https://github.com/XiShaoDong/yuxuan-next-js-fall25" id="wd-lab3-link">
                    My Github Link</a>
            </li>
        </ul>
    );
}
