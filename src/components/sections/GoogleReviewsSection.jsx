import { useEffect } from 'react';

export default function GoogleReviewsSection() {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://elfsightcdn.com/platform.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our Customers Say 
          </h2>
          {/* <p className="text-muted-foreground mt-3">
            Real Google reviews from our patients
          </p>  */}
        </div>

        <div
          className="elfsight-app-f7316404-0922-478b-b284-91c395cd05b6"
          data-elfsight-app-lazy
        />
      </div>
    
    </section>
  );
}
