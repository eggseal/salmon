%% Metodo Iterativo de Seidel
% Calcula la solucion aproximada del sistema Ax=b dado un vector inicial
% x0: Vector inicial
% A: Ax=b
% b: Ax=b
% tol: Tolerancia de error
% iter: Numero maximo de iteraciones
function [E, s] = GaussSeidel(x0, A, b, tol, iter)
    format long
    c = 0;
    err = tol + 1;
    n = length(A);
    while err > tol && c < iter
        x1 = x0;
        for i = 1: n
            sum = 0;
            for j = 1: n
                if j ~= i
                    sum = sum + A(i, j) * x1(j);
                end
            end
            x1(i) = (b(i) - sum) / A(i, i);
        end
        
        err = norm(x1 - x0, inf);
        E(c+1) = err;
        x0 = x1;
        c = c + 1;
    end
    if err < tol
        s = x0;
        fprintf("%f es una aproximacion con tolerancia %f", s, tol)
    else 
        s = x0;
        fprintf("Fracaso en %f iteraciones", iter)
    end
end