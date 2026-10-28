# Credenciales representadas por alias, no contraseñas reales.
# Edite las filas de Examples para agregar escenarios y sus resultados esperados.
Feature: Autenticación segura del portal de prácticas
  Como usuario del portal
  Quiero iniciar sesión con credenciales válidas
  Para acceder únicamente cuando estoy autorizado

  Background:
    Given que ingreso al formulario de autenticación

  @smoke @positivo
  Scenario Outline: Inicio de sesión correcto - <caso>
    When inicio sesión con usuario "<usuario>" y clave "<clave>"
    Then el acceso debe ser "<resultado>"
    And la URL debe contener "<ruta>"
    And debe mostrarse la opción "Log out"

    Examples:
      | caso             | usuario       | clave          | resultado | ruta                   |
      | usuario correcto | VALID_USER    | VALID_PASSWORD | exitoso   | logged-in-successfully |

  @negativo @seguridad
  Scenario Outline: Rechazar credenciales inválidas - <caso>
    When inicio sesión con usuario "<usuario>" y clave "<clave>"
    Then el acceso debe ser "<resultado>"
    And debe mostrarse el error "<mensaje>"
    And no debe mostrarse la opción "Log out"

    Examples:
      | caso                  | usuario       | clave          | resultado | mensaje                |
      | usuario inexistente   | INVALID_USER  | VALID_PASSWORD | rechazado | Your username is invalid! |
      | contraseña incorrecta | VALID_USER    | INVALID_PASS   | rechazado | Your password is invalid! |
      | usuario vacío         | EMPTY         | VALID_PASSWORD | rechazado | Your username is invalid! |
      | clave vacía           | VALID_USER    | EMPTY          | rechazado | Your password is invalid! |
