/**
 * Skip link for keyboard navigation
 * Allows users to skip directly to main content
 */
export function SkipLink() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector("main") || document.getElementById("main-content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
      main.removeAttribute("tabindex");
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="skip-link"
    >
      Pular para o conteúdo principal
    </a>
  );
}
