import { notFound } from 'next/navigation';

// Cualquier ruta desconocida muestra el 404 jugable dentro del layout del sitio.
export default function CatchAll() {
  notFound();
}
