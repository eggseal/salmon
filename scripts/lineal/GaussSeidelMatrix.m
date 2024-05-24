%% Metodo Iterativo de Seidel
% Calcula la solucion aproximada del sistema Ax=b dado un vector inicial
% x0: Vector inicial
% A: Ax=b
% b: Ax=b
% tol: Tolerancia de error
% iter: Numero maximo de iteraciones
function [E, s] = GaussSeidelMatrix(x0, A, b, tol, iter)
    format long
    c = 0;
    err = tol + 1;

    D = diag(diag(A))
    L = -tril(A, -1);
    U = -triu(A, +1);
    while err > tol && c < iter
        T = (D - L) \ U;
        C = (D - L) \ b;
        x1 = T * x0 + C;

        err = norm(x1 - x0, inf);
        E(c+1) = err;
        x0 = x1;
        c = c + 1;
    end
    s = x0;
    if err < tol
        fprintf("%f aproxima con tolerancia %f", s, tol)
    else
        fprintf("Fracaso en %f iteraciones", iter)
    end
end
