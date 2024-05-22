%% Polinomio interpolante de Newton (Diferencias divididas)
% Para hallar el polinomio solucion se suma cada valor de sol multiplicada
% por el producto de (x - xi-1), el producto se omite para x0 porque no hay
% un x-1
function [tab, sol] = NewtonDifference(x, y)
    format long
    n = length(x);
    tab = zeros(n, n+1);
    tab(:,1) = x;
    tab(:,2) = y;
    sol(1) = y(1);
    for j = 3: n+1
        sol(j-1) = (tab(j-1, j-1) - tab(j-2, j-1)) / (tab(j-1, 1) - tab(j-1-j+2, 1));
        for i = j-1: n
            tab(i, j) = (tab(i, j-1) - tab(i-1, j-1)) / (tab(i, 1) - tab(i-j+2, 1));
        end
    end
end