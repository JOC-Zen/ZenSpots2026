import { test, expect } from '@playwright/test';

test('Flujo de reserva de usuario: navegar, elegir horario y confirmar', async ({ page }) => {
  // Simular usuario autenticado no anfitrión
  const user = {
    id: 999,
    name: 'Usuario Test',
    email: 'user@test.local',
    avatarUrl: 'https://placehold.co/64x64',
    isHost: false,
    bio: 'Tester',
  };
  await page.addInitScript(([u]) => {
    localStorage.setItem('zenSpotsUser', JSON.stringify(u));
  }, [user]);

  await page.goto('/');

  // Ir a explorar espacios
  await page.getByTestId('nav-browse').click();

  // Seleccionar el primer espacio de la lista
  const firstCard = page.getByTestId('space-card').first();
  await firstCard.click();

  // Esperar que el widget de reserva esté visible
  await expect(page.getByTestId('booking-date')).toBeVisible();

  // Seleccionar la fecha de mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  await page.getByTestId('booking-date').fill(tomorrowStr);

  // Seleccionar hora de inicio y fin
  const startSelect = page.getByTestId('start-time-select');
  await startSelect.selectOption({ index: 1 }); // primera opción válida distinta de placeholder
  const endSelect = page.getByTestId('end-time-select');
  await endSelect.selectOption({ index: 1 });

  // Reservar ahora
  await page.getByTestId('btn-book-now').click();

  // Comprobar que llegamos a confirmación
  await expect(page.getByText('¡Reserva Confirmada!')).toBeVisible();
});