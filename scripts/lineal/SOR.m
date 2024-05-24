%% Metodo Iterativo SOR

function [E, s] = SOR(x0, A, b, tol, iter, w)
    format long
    c = 0;
    err = tol + 1;

    D = diag(diag(A))
    L = -tril(A, -1);
    U = -triu(A, +1);
    while err > tol && c < iter
        T = (D - w*L) \ ((1 - w)*D + w*U);
        C = w \ (D - w*L) \ b;
        x1 = T * x0 + C;

        err = norm(x1 - x0, inf);
        E(c+1) = err;
        x0 = x1;
        c = c + 1;
    end
    s = x0;
    if err < tol
        fprintf("%f aproxuma con tolerancia %f", s, err)
    else
        fprintf("Fracaso en %f iteraciones", iter)
    end
end