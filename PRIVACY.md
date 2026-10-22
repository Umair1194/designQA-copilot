# Privacy

Figma design reviews run locally and do not transmit layer content. Saved issue baselines and preferences use Figma client storage; the plugin’s About tab can clear them.

Website reviews connect only to the local service at `http://localhost:4318`. The entered URL is sent to that service. A fresh Chromium context requests the website and its assets; the website and its asset providers receive ordinary browser requests. No Figma layers are included. The browser context is closed after the review.

The local service uses a session key, binds to loopback and rejects private/reserved website destinations. Keys are kept in plugin memory. Page screenshots and reports remain in service memory for the latest ten reviews and disappear when it stops. Report URLs contain random identifiers; anyone with a report URL and access to the local service can view it.

Website feedback appears on screenshot copies. The service does not edit a deployed website, log in, submit forms or connect to analytics accounts. Exports and Figma report frames persist wherever the user saves them.
