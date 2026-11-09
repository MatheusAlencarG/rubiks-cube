import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import GeneralConfigs from './Components/GeneralConfigs';
import GeneralConfigContext from './Contexts/GeneralConfigContext/GeneralConfigContext';

beforeEach(() => localStorage.clear());

test('switches the interface language through settings', () => {
  render(
    <GeneralConfigContext>
      <GeneralConfigs />
    </GeneralConfigContext>
  );

  fireEvent.click(screen.getByRole('button', { name: 'configurações' }));
  fireEvent.click(screen.getByText('idiomas'));
  fireEvent.click(screen.getByLabelText('English'));

  expect(screen.getByRole('heading', { name: 'configurations' })).toBeInTheDocument();
  expect(screen.getByLabelText('English')).toBeChecked();
  expect(screen.getByLabelText('Português')).not.toBeChecked();
});

test('settings support Escape, focus return and accessible language disclosure', () => {
  render(
    <GeneralConfigContext>
      <GeneralConfigs />
    </GeneralConfigContext>
  );
  const trigger = screen.getByRole('button', { name: 'configurações' });
  fireEvent.click(trigger);
  const close = screen.getByRole('button', { name: 'Fechar configurações' });
  expect(close).toHaveFocus();
  const disclosure = screen.getByRole('button', { name: /idiomas/ });
  expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(disclosure);
  expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('region', { name: /idiomas/ })).toHaveClass('active');
  screen.getByLabelText('English').focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('theme and hints preferences are stored for visitors', () => {
  render(
    <GeneralConfigContext>
      <GeneralConfigs />
    </GeneralConfigContext>
  );
  fireEvent.click(screen.getByRole('button', { name: 'configurações' }));
  fireEvent.click(screen.getByRole('button', { name: /^Tema/ }));
  fireEvent.change(screen.getByLabelText('Aparência'), { target: { value: 'light' } });
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(document.documentElement.style.getPropertyValue('--black')).toBe('#eef2f7');
  fireEvent.click(screen.getByRole('button', { name: /^Dicas/ }));
  fireEvent.click(screen.getByLabelText('Modo dicas'));
  const stored = JSON.parse(localStorage.getItem('rubiks.ui.v1')!);
  expect(stored.themeMode).toBe('light');
  expect(stored.hintsEnabled).toBe(true);
  expect(screen.getByText(/O sistema de dicas será disponibilizado/)).toBeInTheDocument();
});
