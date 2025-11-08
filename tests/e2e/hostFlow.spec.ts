import { test, expect } from '@playwright/test';

test('Flujo de anfitrión: ir a perfil, dashboard, gestionar disponibilidad y guardar', async ({ page }) => {
  // Simular usuario anfitrión
  const hostUser = {
    id: 1,
    name: 'Anfitrión Test',
    email: 'host@test.local',
    avatarUrl: 'https://placehold.co/64x64',
    isHost: true,
    bio: 'Tester host',
  };
  await page.addInitScript(([u]) => {
    localStorage.setItem('zenSpotsUser', JSON.stringify(u));
  }, [hostUser]);

  await page.goto('/');

  // Ir a perfil
  await page.getByTestId('nav-profile').click();
  await expect(page.getByText(hostUser.name)).toBeVisible();

  // Ir al Panel de Anfitrión
  await page.getByTestId('btn-host-dashboard').click();
  await expect(page.getByText('Panel de Anfitrión')).toBeVisible();

  // Gestionar Calendario del primer espacio
  await page.getByTestId('btn-manage-availability').first().click();
  await expect(page.getByText('Gestionar Disponibilidad')).toBeVisible();

  // Seleccionar fecha de hoy explícitamente
  const todayStr = new Date().toISOString().split('T')[0];
  await page.getByTestId(`date-${todayStr}`).click();

  // Habilitar todo y guardar
  await page.getByTestId('btn-enable-all').click();
  await page.getByTestId('btn-save-availability').click();

  // De vuelta al dashboard
  await expect(page.getByText('Panel de Anfitrión')).toBeVisible();
});