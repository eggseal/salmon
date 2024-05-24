%% Metodo iterativo de busqueda incremental
% Busca la existencia de la raiz aumentado poco a poco desde un x inicial
% x0: Punto inicial de la busqueda
% dx: Incremento de la busqueda
% n: Numero maximo de iteraciones
function [tab, sol] = IncrementalSearch(x0, dx, n)
    format long
    syms x
    f(x) = x^2 - 5*x +6*sin(x);

    f0 = eval(subs(f, x0));
    if f0 == 0
        sol = x0;
        tab = table(0, x0, f0, 'VariableNames', {'i', 'xi', 'f(xi)'});
        fprintf("Raiz de f(x): %f", sol)
    else
        x1 = x0 + dx;
        f1 = eval(subs(f, x1));
        c = 1;

        tab = table(c-1, x0, f0, 'VariableNames', {'i', 'xi', 'f(xi)'});
        while f0 * f1 > 0 && c <= n
            x0 = x1;
            f0 = f1;
            tab(c,:) = {c, x0, f0};
            
            x1 = x0 + dx;
            f1 = eval(subs(f, x1));
            c = c + 1;
        end
        tab(c,:) = {c, x1, f1};
        sol = [x0, x1];
        if f1 == 0
            fprintf("Raiz de f(x): %f", x1)
        elseif f1 * f0 < 0
            fprintf("Raiz de f(x): [%f, %f]",x0, x1);
        else
            fprintf("Fracaso en i=%f", c);
        end
    end
end

        
