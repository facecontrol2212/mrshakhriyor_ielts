import { ThornburyParkMap } from './ThornburyParkMap'

/**
 * Maps, plans and diagrams referenced by `visual` keys in test content.
 * Register a new visual by adding a case here.
 */
export function Visual({ name }: { name: string }) {
  switch (name) {
    case 'thornbury-park':
      return <ThornburyParkMap />
    default:
      return <p style={{ padding: 16 }}>Image not available.</p>
  }
}
