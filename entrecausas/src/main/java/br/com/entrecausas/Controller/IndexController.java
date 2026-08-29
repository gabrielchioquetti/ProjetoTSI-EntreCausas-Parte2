package br.com.entrecausas.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class IndexController {
    
    @GetMapping("/")
    public String paginaInicial() {
        return "index";
    }
    
}
